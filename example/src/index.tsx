import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FixedPositionExample from './FixedPositionExample';
import StickyPositionExample from './StickyPositionExample';
import StyledSectionsExample from './StyledSectionsExample';
import HorizontalExample from './HorizontalExample';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import theme from './theme';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="fixed-position" element={<FixedPositionExample />} />
          <Route path="sticky-position" element={<StickyPositionExample />} />

          <Route path="styled-sections" element={<StyledSectionsExample />} />
          <Route path="horizontal" element={<HorizontalExample />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
