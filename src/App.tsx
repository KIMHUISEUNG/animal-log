import ModalProvider from "./provider/modal-provider";
import SessionProvider from "./provider/session-provider";
import RootRooute from "./root-route";

export default function App() {
  return (
    <SessionProvider>
      <ModalProvider>
        <RootRooute />
      </ModalProvider>
    </SessionProvider>
  );
}
