import React from 'react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import BasecampCheckInView from './BasecampCheckInView.jsx';

/**
 * BasecampCheckOutView
 * Telah disatukan dengan Pos Basecamp terpadu (BasecampCheckInView).
 * Merender tab 'checkout' secara default.
 */
export default function BasecampCheckOutView() {
  const { staging } = useCompetition?.() || {};
  const isTeamCheckedOut = (teamId) => {
    const st = staging?.[teamId] || staging?.basecamp?.[teamId] || null;
    return Boolean(st?.checkedOut || st?.stage === 'checkout' || st?.basecampLogistics?.ktpReturned);
  };
  return <BasecampCheckInView initialTab="checkout" isTeamCheckedOut={isTeamCheckedOut} />;
}
