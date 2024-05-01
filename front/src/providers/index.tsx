import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Theme } from '@radix-ui/themes';
import RouteProvider from '../routes';
import { Provider as ReactWrapBalancer } from 'react-wrap-balancer';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Theme>
          <RouteProvider>
            <ReactWrapBalancer>{children}</ReactWrapBalancer>
          </RouteProvider>
        </Theme>
      </QueryClientProvider>
    </>
  );
}
