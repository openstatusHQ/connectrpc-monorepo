import { useQuery } from "@connectrpc/connect-query";
import {Button} from "@prostack/ui/components/ui/button"
import { shorten } from "./gen/proto/urlshortener/v1/urlshortener-UrlShortenerService_connectquery";

function App() {
  const data = useQuery(shorten, {
    url: "http://openstatus.dev",
  });

  if (data.isLoading) return <div> Loading </div>;

  if (data.isError) return <div> Error </div>;
  return (<>

    <div>
      URL:
      {data.data?.url}
    </div>
  </>);
}

export default App;
