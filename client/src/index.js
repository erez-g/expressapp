// import { hot } from "react-hot-loader/root";
import React from 'react';
import { BrowserRouter, 
  Outlet, 
  Link,
  Route, 
  Routes } from 'react-router-dom';
// import ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ReactBootstrap from 'react-bootstrap';
import * as bootstrap from 'bootstrap';
import App from './App';
import Create from './routes/Create.jsx';
import About from './routes/About.jsx';
import reportWebVitals from './reportWebVitals';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


// Create a root.
const container = document.getElementById('root');
// const root = ReactDOMClient.createRoot(container);

// root.render(<App/>);

ReactDOMClient.createRoot(container).render(
  <>
    <BrowserRouter>
    <Navbar/>
    <div id="main">
    <Routes>
          <Route path="/" element={<App />} />
          <Route path="create" element={<Create />} />
          <Route path="about" element={<About />} />
          <Route
            path="*"
            element={
              <main style={{ padding: '1rem' }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
    </Routes>
      </div>
  </BrowserRouter>
    <Footer/>
  </>
);



//deprecated in R18
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
