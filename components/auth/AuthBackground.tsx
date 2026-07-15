'use client';

import {motion} from 'motion/react';

export function AuthBackground() {
  return (
    <div className="login-page-bg absolute inset-0 overflow-hidden">
      <motion.div
        className="login-orb login-orb-pink"
        animate={{x: [0, 18, -8, 0], y: [0, -12, 8, 0], scale: [1, 1.06, 0.98, 1]}}
        transition={{duration: 18, repeat: Infinity, ease: 'easeInOut'}}
      />
      <motion.div
        className="login-orb login-orb-lavender"
        animate={{x: [0, -14, 10, 0], y: [0, 10, -14, 0], scale: [1, 0.96, 1.04, 1]}}
        transition={{duration: 22, repeat: Infinity, ease: 'easeInOut'}}
      />
      <motion.div
        className="login-orb login-orb-blue"
        animate={{x: [0, 12, -16, 0], y: [0, -8, 12, 0], scale: [1, 1.03, 0.97, 1]}}
        transition={{duration: 20, repeat: Infinity, ease: 'easeInOut'}}
      />
    </div>
  );
}
