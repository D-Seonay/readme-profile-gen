'use client';

import Script from 'next/script';

export const BMCWidget = () => {
  return (
    <Script
      src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
      data-name="BMC-Widget"
      data-cfasync="false"
      data-id="dseonay"
      data-description="Support me on Buy me a coffee!"
      data-message=""
      data-color="#5F7FFF"
      data-position="Right"
      data-x_margin="18"
      data-y_margin="18"
      strategy="afterInteractive"
    />
  );
};
