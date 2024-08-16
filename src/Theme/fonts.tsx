// import { Global } from '@emotion/react'
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    body: `'Manrope', sans-serif`,
  },
  colors: {
    brand: {
      100: '#5fa5fa',
      900: '#0054DA',
    },
  },
})

export default theme

// const Fonts = () => (
//   <Global
//     styles={`
//       /* Copied from https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&family=Raleway&display=swap */

//       /* latin-ext */
//       @font-face {
//         font-family: 'Open Sans';
//         font-style: normal;
//         font-weight: 700;
//         font-display: swap;
//         src: url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN7rgOXOhpKKSTj5PW.woff2) format('woff2');
//         unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
//       }
//       /* latin */
//       @font-face {
//         font-family: 'Open Sans';
//         font-style: normal;
//         font-weight: 700;
//         font-display: swap;
//         src: url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN7rgOUuhpKKSTjw.woff2) format('woff2');
//         unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
//       }
//       /* latin-ext */
// @font-face {
//   font-family: 'Poppins';
//   font-style: normal;
//   font-weight: 400;
//   font-display: swap;
//   src: url(https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJnecmNE.woff2) format('woff2');
//   unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
// }
// /* latin */
// @font-face {
//   font-family: 'Poppins';
//   font-style: normal;
//   font-weight: 400;
//   font-display: swap;
//   src: url(https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
//   unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
// }

// /* latin-ext */
// @font-face {
//   font-family: 'Poppins';
//   font-style: normal;
//   font-weight: 600;
//   font-display: swap;
//   src: url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1JlFc-K.woff2) format('woff2');
//   unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
// }
// /* latin */
// @font-face {
//   font-family: 'Poppins';
//   font-style: normal;
//   font-weight: 600;
//   font-display: swap;
//   src: url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
//   unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
// }
//       `}
//   />
// )

// export default Fonts
