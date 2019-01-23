import "reflect-metadata"
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {MuiThemeProvider, createMuiTheme, Theme} from '@material-ui/core/styles';


const theme = createMuiTheme({

    props: {
        MuiGrid: {
            style: {
            }
        },
        MuiPaper: {
            style: {
            },
            elevation: 2,
            square: true,
        },
        MuiButton: {
            style: {
                maxWidth: 150
            }
        },
        MuiInput: {
            style: {
                marginRight: 25,
                border: "none"
            },

        },
    },
    palette: {
        primary: {
            main: '#f06292'
        },
        secondary: {
            main: '#ec407a'
        },
    },
    typography: {
        useNextVariants: true,
    }
});

// const styles = {
//     root: {
//         flexGrow: 1,
//     },
//     paper: {
//         padding: theme.spacing.unit * 2,
//         textAlign: 'center',
//         color: theme.palette.text.secondary,
//     },
// };

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
            <App />
    </MuiThemeProvider>,
        document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
