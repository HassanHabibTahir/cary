const express = require('express');
const path = require('path');
const cloudClient = require('cloud-config-client');
const fs = require('fs').promises;

const app = express();

async function loadConfiguration() {
    const configParams = {
        application: process.env.SPRING_APPLICATION_NAME || 'quik-auction-web',
        endpoint: process.env.CONFIGSERVER_NAME || 'http://c-config-dev4.copart.com',
        profiles: process.env.PROFILES ? process.env.PROFILES.split(',') : ['c-dev4'],
        auth: {
            user: process.env.CONFIGSERVER_USER || 'user',
            pass: process.env.CONFIGSERVER_PASSWORD || 'copart',
        },
    };
    console.log('configParams : -->' + JSON.stringify(configParams));
    try {
        const config = await cloudClient.load(configParams);
        const properties = config.properties;
        process.env = { ...process.env, ...properties };
        console.log('Configuration loaded from cloud config server');
        if(process.env.LOG_LEVEL && process.env.LOG_LEVEL == "debug") {
            console.log(JSON.stringify(properties));
        }
        
        const profilesArray = process.env.PROFILES.split(',');
        const profileKey = profilesArray.find(profile => profile !== "kubernetes");

        const envKey = `${profileKey}.ENV`;

        const unifiedEnvProperties = Object.keys(properties)
            .filter(key => key.startsWith(envKey))
            .reduce((acc, key) => {
                const newKey = key.replace(`${envKey}.`, '');
                acc[newKey] = properties[key];
                return acc;
            }, {});

        return unifiedEnvProperties;
    } catch (err) {
        console.error('Error loading config from cloud config server:', err);
        throw err;
    }
}

async function replacePlaceholders(basePath, properties) {
    const filesAndDirs = await fs.readdir(basePath, { withFileTypes: true });

    for (const dirent of filesAndDirs) {
        const currentPath = path.join(basePath, dirent.name);
        if (dirent.isDirectory()) {
            await replacePlaceholders(currentPath, properties);
        } else if (dirent.isFile()) {
            await replaceInFile(currentPath, properties);
        }
    }
}

async function replaceInFile(filePath, properties) {
    let content = await fs.readFile(filePath, 'utf-8');
    let replaced = false;

    for (const [key, value] of Object.entries(properties)) {
        const pattern = new RegExp(`%%%${key}%%%`, 'g');
        if (pattern.test(content)) {
            content = content.replace(pattern, value);
            replaced = true;
        }
    }

    if (replaced) {
        await fs.writeFile(filePath, content);
        console.log(`Replaced placeholders in ${filePath}`);
    }
}

function initializeServer() {
    const PORT = process.env.PORT || 3000;

    app.use(express.static(path.join(__dirname, 'dist')));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

async function main() {
    try {
        const properties = await loadConfiguration();
        await replacePlaceholders(path.join(__dirname, 'dist'), properties);
        initializeServer();
    } catch (err) {
        console.error('Failed to start the application:', err);
    }
}

main();
