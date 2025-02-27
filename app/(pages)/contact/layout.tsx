import React from 'react';

export const metadata = {
  title: 'Contact Us | Widget Support',
  description: 'Get in touch with our support team for help with widget embedding and customization.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
    </section>
  );
} 