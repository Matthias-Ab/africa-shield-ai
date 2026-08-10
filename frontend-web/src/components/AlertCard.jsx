import {
  AlertTriangle,
  Clock3,
  MapPin,
  ChevronRight,
} from "lucide-react";

function AlertCard({ alert }) {
  const getLevelClass = (level) => {
    switch (level) {
      case "High":
        return "alert-high";

      case "Medium":
        return "alert-medium";

      case "Low":
        return "alert-low";

      default:
        return "";
    }
  };

  return (
    <article className={`alert-card ${getLevelClass(alert.level)}`}>
      <div className="alert-card-header">
        <div className="alert-icon">
          <AlertTriangle size={19} />
        </div>

        <div className="alert-heading">
          <div className="alert-location">
            <MapPin size={14} />
            <span>
              {alert.region}, {alert.country}
            </span>
          </div>

          <h4>{alert.hazard}</h4>
        </div>

        <span className="alert-level">{alert.level}</span>
      </div>

      <p className="alert-message">{alert.message}</p>

      {alert.localMessage && (
        <div className="local-language-alert">
          <span>{alert.localLanguage}</span>
          <p>{alert.localMessage}</p>
        </div>
      )}

      <div className="alert-card-footer">
        <div className="alert-time">
          <Clock3 size={14} />
          <span>{alert.time}</span>
        </div>

        <button className="view-alert-button">
          View alert
          <ChevronRight size={15} />
        </button>
      </div>
    </article>
  );
}

export default AlertCard;