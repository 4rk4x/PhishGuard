import React from 'react';
import { Sparkles, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

export const DemoUrlPills = ({ onSelectUrl }) => {
  const sampleUrls = [
    {
      label: 'Benign Research URL',
      type: 'safe',
      icon: ShieldCheck,
      color: 'text-electric border-electric/30 hover:bg-electric/10',
      url: 'https://en.wikipedia.org/wiki/Phishing',
      description: 'Legitimate canonical HTTPS domain'
    },
    {
      label: 'Direct IP Phishing Attack',
      type: 'phishing',
      icon: ShieldAlert,
      color: 'text-red-400 border-red-500/30 hover:bg-red-500/10',
      url: 'http://192.168.1.100/paypal/login.php?cmd=update',
      description: 'Raw IP address + login keyword'
    },
    {
      label: 'Subdomain Brand Spoofing',
      type: 'phishing',
      icon: ShieldAlert,
      color: 'text-red-400 border-red-500/30 hover:bg-red-500/10',
      url: 'https://appleid.apple.com.secure-update-notice.top/account',
      description: 'Multi-tier deceptive subdomains + bad TLD'
    },
    {
      label: 'Shortener Masked Redirection',
      type: 'suspicious',
      icon: AlertTriangle,
      color: 'text-amber-400 border-amber-500/30 hover:bg-amber-500/10',
      url: 'http://bit.ly/34xPaypalSecurityAlert',
      description: 'Concealed destination via shortening service'
    },
    {
      label: 'Credential @ Ingestion Trick',
      type: 'phishing',
      icon: ShieldAlert,
      color: 'text-red-400 border-red-500/30 hover:bg-red-500/10',
      url: 'http://google.com@phish-credentials-steal.net/auth/verify',
      description: 'Browser ignores pre-@ content'
    }
  ];

  return (
    <div className="mt-4">
      <div className="flex items-center gap-1.5 text-xs font-mono text-navy-muted mb-2">
        <Sparkles className="w-3.5 h-3.5 text-electric" />
        <span>Academic Evaluation Quick-Test Samples:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sampleUrls.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectUrl(item.url)}
              title={item.description}
              className={`px-3 py-1.5 rounded-lg border bg-navy-surface text-xs font-mono transition flex items-center gap-1.5 ${item.color}`}
            >
              <Icon className="w-3 h-3 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

