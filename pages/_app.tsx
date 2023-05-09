import { Provider } from "react-redux";
import { wrapper } from "../src/store";

import "../src/styles/main.css";

function App({ Component, pageProps, ...rest }: any) {
  const { store } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
