import { motion, AnimatePresence } from "framer-motion";
import { useRecoilState } from "recoil";
import { notificationState } from "../atoms/NotificationAtom";

function Notification({ code, message, reason, recommended }) {
  const [notification, setNotification] = useRecoilState(notificationState);

  const Path = (props) => (
    <motion.path
      fill="transparent"
      strokeWidth="3"
      stroke="hsl(0, 0%, 18%)"
      strokeLinecap="round"
      {...props}
    />
  );
  const CloseNotification = ({ close }) => (
    <button onClick={close} className="absolute top-4 right-3 border-none">
      <svg width="23" height="23" viewBox="0 0 23 23">
        <Path d="M 3 16.5 L 17 2.5" />
        <Path d="M 3 2.5 L 17 16.346" />
      </svg>
    </button>
  );

  return (
    // <div className="fixed top-0 left-0 flex flex-col list-none	justify-end">
    //   <p>{code}</p>
    // </div>
    <AnimatePresence initial={false}>
      <motion.li
        key={1}
        className="w-full bg-red-100 relative rounded-xl p-5"
        positionTransition
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      >
        <p>
          Error code: <b>{code}</b>
        </p>
        <p>
          Message: <b>{message}</b>
        </p>
        <p>
          Reason: <b>{reason}</b>
        </p>
        <p>
          Recommended action: <b>{recommended}</b>
        </p>
        <CloseNotification close={() => setNotification()} />
      </motion.li>
    </AnimatePresence>
  );
}

export default Notification;
