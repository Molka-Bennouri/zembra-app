import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./stripe";
import Checkout from "./payment/Checkout";

function App() {
  
  const token = "71TvrEKSjg9aIalEXcf5bhkivaCQOh3WAFTT4nHugs8KJ4a0a0PLq1pZ02vNVp3A";

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto" }}>
      <h2>💳 Subscription Payment</h2>

      <Elements stripe={stripePromise}>
        <Checkout planId={1} token={token} />
      </Elements>
    </div>
  );
}

export default App;