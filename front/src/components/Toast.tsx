import * as Toast from '@radix-ui/react-toast';
import 'src/styles/toast.css';

const CustomToast = (props: {
  open: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
}) => {
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root className={`ToastRoot ${props.type}`} open={props.open}>
        <Toast.Title className="ToastTitle">{props.children}</Toast.Title>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
};

export default CustomToast;
