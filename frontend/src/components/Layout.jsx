import Footer from './Footer';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';


const Layout = () => {
  return (
    <>
      <Navbar />
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
        <Footer />
    </>
  );
};

export default Layout;
