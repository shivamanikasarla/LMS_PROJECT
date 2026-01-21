import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import FirstPage from './FirstPage';
import Webinars from './Webinars';
import WebinarDetail from './WebinarDetail';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

function Webinar() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<PageTransition><FirstPage /></PageTransition>} />
        <Route path="webinars" element={<PageTransition><Webinars /></PageTransition>} />
        <Route path=":id" element={<PageTransition><WebinarDetail /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default Webinar;