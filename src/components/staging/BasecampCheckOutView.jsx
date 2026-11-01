import React from 'react';
import BasecampCheckInView from './BasecampCheckInView.jsx';

/**
 * BasecampCheckOutView
 * Telah disatukan dengan Pos Basecamp terpadu (BasecampCheckInView).
 * Merender tab 'checkout' secara default.
 */
export default function BasecampCheckOutView() {
  return <BasecampCheckInView initialTab="checkout" />;
}
