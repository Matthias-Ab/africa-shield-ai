import {
  Bell,
  CheckCircle2,
  Clock3,
  Contrast,
  Eye,
  Globe2,
  Info,
  Languages,
  Monitor,
  Radio,
  RotateCcw,
  Save,
  Settings as SettingsIcon,
  Smartphone,
  Volume2,
  Waves,
} from "lucide-react";
import { useState } from "react";

function Settings() {
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    criticalAlerts: true,
    highRiskAlerts: true,
    communityReports: true,
    regionalChanges: true,

    sms: true,
    voice: true,
    radio: true,
    community: true,

    largeText: false,
    highContrast: false,
    audioWarnings: true,
    reducedMotion: false,

    language: "English",

    autoRefresh: true,
    refreshInterval: "5",
    showRiskScores: true,
    showRainfall: true,
  });

  const updateSetting = (name, value) => {
    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      "afrishield-settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const resetSettings = () => {
    const defaults = {
      criticalAlerts: true,
      highRiskAlerts: true,
      communityReports: true,
      regionalChanges: true,

      sms: true,
      voice: true,
      radio: true,
      community: true,

      largeText: false,
      highContrast: false,
      audioWarnings: true,
      reducedMotion: false,

      language: "English",

      autoRefresh: true,
      refreshInterval: "5",
      showRiskScores: true,
      showRainfall: true,
    };

    setSettings(defaults);
    setSaved(false);
  };

  return (
    <main className="min-h-full bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />

              <p className="text-[10px] font-extrabold uppercase tracking-[1.7px] text-blue-600">
                SYSTEM CONFIGURATION
              </p>
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Configure AfriShield monitoring, warning channels,
              accessibility and alert preferences.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetSettings}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <RotateCcw size={14} />
              Reset
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-extrabold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
            >
              <Save size={14} />
              Save changes
            </button>
          </div>
        </div>

        {/* Saved Message */}
        {saved && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <CheckCircle2
              size={17}
              className="shrink-0 text-emerald-600"
            />

            <div>
              <p className="text-xs font-extrabold text-emerald-700">
                Settings saved successfully
              </p>

              <p className="mt-0.5 text-[10px] text-emerald-600">
                Your AfriShield configuration has been updated.
              </p>
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <Monitor size={19} />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-blue-600">
                  SYSTEM STATUS
                </p>

                <p className="mt-1 text-sm font-extrabold text-slate-800">
                  AfriShield monitoring is operational
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Monitoring active
            </div>
          </div>
        </div>

        {/* Main Settings */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Alert Preferences */}
          <SettingsCard
            icon={Bell}
            label="ALERT PREFERENCES"
            title="Flood Alert Preferences"
            description="Choose which events should appear in the command center."
          >
            <Toggle
              label="Critical flood alerts"
              description="Receive the most urgent flood warnings."
              checked={settings.criticalAlerts}
              onChange={(value) =>
                updateSetting("criticalAlerts", value)
              }
            />

            <Toggle
              label="High-risk alerts"
              description="Show alerts for regions classified as high risk."
              checked={settings.highRiskAlerts}
              onChange={(value) =>
                updateSetting("highRiskAlerts", value)
              }
            />

            <Toggle
              label="Community reports"
              description="Include ground-level reports from communities."
              checked={settings.communityReports}
              onChange={(value) =>
                updateSetting("communityReports", value)
              }
            />

            <Toggle
              label="Regional risk changes"
              description="Notify when a monitored region changes risk level."
              checked={settings.regionalChanges}
              onChange={(value) =>
                updateSetting("regionalChanges", value)
              }
            />
          </SettingsCard>

          {/* Warning Channels */}
          <SettingsCard
            icon={Radio}
            label="LAST-MILE WARNING"
            title="Warning Channels"
            description="Configure the channels used to reach communities."
          >
            <Toggle
              icon={Smartphone}
              label="SMS alerts"
              description="Send warnings through mobile text messages."
              checked={settings.sms}
              onChange={(value) => updateSetting("sms", value)}
            />

            <Toggle
              icon={Volume2}
              label="Voice alerts"
              description="Support warnings through voice and audio."
              checked={settings.voice}
              onChange={(value) => updateSetting("voice", value)}
            />

            <Toggle
              icon={Radio}
              label="Radio communication"
              description="Support communication through radio networks."
              checked={settings.radio}
              onChange={(value) => updateSetting("radio", value)}
            />

            <Toggle
              icon={Globe2}
              label="Community channels"
              description="Enable community leaders and local responders."
              checked={settings.community}
              onChange={(value) => updateSetting("community", value)}
            />
          </SettingsCard>

          {/* Accessibility */}
          <SettingsCard
            icon={Eye}
            label="INCLUSIVE ACCESS"
            title="Accessibility"
            description="Make flood intelligence easier to understand and access."
          >
            <Toggle
              icon={Eye}
              label="Larger text"
              description="Increase interface text size for readability."
              checked={settings.largeText}
              onChange={(value) =>
                updateSetting("largeText", value)
              }
            />

            <Toggle
              icon={Contrast}
              label="High contrast"
              description="Increase visual contrast between interface elements."
              checked={settings.highContrast}
              onChange={(value) =>
                updateSetting("highContrast", value)
              }
            />

            <Toggle
              icon={Volume2}
              label="Audio warnings"
              description="Support important warnings through audio."
              checked={settings.audioWarnings}
              onChange={(value) =>
                updateSetting("audioWarnings", value)
              }
            />

            <Toggle
              label="Reduced motion"
              description="Reduce interface animations and transitions."
              checked={settings.reducedMotion}
              onChange={(value) =>
                updateSetting("reducedMotion", value)
              }
            />
          </SettingsCard>

          {/* Language */}
          <SettingsCard
            icon={Languages}
            label="LOCALIZATION"
            title="Language & Region"
            description="Choose the language used by the command center."
          >
            <div>
              <label
                htmlFor="language"
                className="mb-2 block text-xs font-bold text-slate-700"
              >
                Interface language
              </label>

              <select
                id="language"
                value={settings.language}
                onChange={(event) =>
                  updateSetting("language", event.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
                <option value="English">English</option>
                <option value="Swahili">Swahili</option>
                <option value="Somali">Somali</option>
                <option value="Arabic">Arabic</option>
              </select>

              <p className="mt-2 text-[10px] leading-5 text-slate-400">
                Local-language support can help warnings reach communities
                in a form they understand.
              </p>
            </div>
          </SettingsCard>

          {/* Monitoring */}
          <SettingsCard
            icon={Waves}
            label="LIVE MONITORING"
            title="Monitoring Preferences"
            description="Control how regional flood information is displayed."
          >
            <Toggle
              icon={RotateCcw}
              label="Automatic refresh"
              description="Automatically refresh regional monitoring data."
              checked={settings.autoRefresh}
              onChange={(value) =>
                updateSetting("autoRefresh", value)
              }
            />

            <div className="border-t border-slate-100 pt-4">
              <label
                htmlFor="refreshInterval"
                className="mb-2 block text-xs font-bold text-slate-700"
              >
                Refresh interval
              </label>

              <select
                id="refreshInterval"
                value={settings.refreshInterval}
                disabled={!settings.autoRefresh}
                onChange={(event) =>
                  updateSetting(
                    "refreshInterval",
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
                <option value="1">Every 1 minute</option>
                <option value="5">Every 5 minutes</option>
                <option value="10">Every 10 minutes</option>
                <option value="15">Every 15 minutes</option>
              </select>
            </div>

            <Toggle
              label="Show risk scores"
              description="Display numerical risk scores on monitoring views."
              checked={settings.showRiskScores}
              onChange={(value) =>
                updateSetting("showRiskScores", value)
              }
            />

            <Toggle
              label="Show rainfall information"
              description="Display recent rainfall measurements."
              checked={settings.showRainfall}
              onChange={(value) =>
                updateSetting("showRainfall", value)
              }
            />
          </SettingsCard>

          {/* System Information */}
          <SettingsCard
            icon={Info}
            label="SYSTEM INFORMATION"
            title="AfriShield Configuration"
            description="Current platform and monitoring information."
          >
            <InfoRow
              label="Monitoring network"
              value="Africa"
            />

            <InfoRow
              label="Monitored regions"
              value="9"
            />

            <InfoRow
              label="Risk intelligence"
              value="Active"
              valueClass="text-emerald-600"
            />

            <InfoRow
              label="Warning system"
              value="Operational"
              valueClass="text-emerald-600"
            />

            <InfoRow
              label="Interface language"
              value={settings.language}
            />

            <InfoRow
              label="Last configuration update"
              value="Just now"
            />
          </SettingsCard>
        </div>

        {/* Bottom Information */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Clock3 size={17} />
            </div>

            <div>
              <p className="text-sm font-extrabold text-slate-800">
                Configuration and last-mile response
              </p>

              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-400">
                These preferences help configure how AfriShield presents
                risk information and how warnings can be prepared for
                different communities. Critical flood warnings should
                always be verified through appropriate emergency response
                procedures.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 px-1 py-6 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            AfriShield Command Center • System Configuration
          </span>

          <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Monitoring network active
          </span>
        </div>
      </section>
    </main>
  );
}

function SettingsCard({
  icon: Icon,
  label,
  title,
  description,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Icon size={18} />
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-blue-600">
              {label}
            </p>

            <h2 className="mt-1 text-lg font-extrabold text-slate-900">
              {title}
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100 px-5">
        {children}
      </div>
    </section>
  );
}

function Toggle({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
            <Icon size={15} />
          </div>
        )}

        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-700">
            {label}
          </p>

          <p className="mt-0.5 text-[10px] leading-5 text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueClass = "text-slate-700",
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
      <span className="text-xs font-semibold text-slate-500">
        {label}
      </span>

      <span className={`text-xs font-extrabold ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}

export default Settings;