# Pitch Notes — Africa Shield AI (placeholder)

_Fill this in as the demo comes together. Structure below is a starting point._

## The narrative arc

1. **Big vision:** Africa Shield AI — multi-hazard (floods, droughts,
   heatwaves, wildfires, cyclones, earthquakes), continent-wide early
   warning, built for people without smartphones or reliable internet.
2. **Core demo, working today:** "Last-Mile Alert AI" — flooding only,
   end-to-end: rules-based risk score → alert message → translated into a
   local language → simulated SMS/USSD/WhatsApp send → dashboard view.
3. **Future:** expand to the other hazards, real ML model, real SMS
   gateway, offline-first mobile app, community reporting, IoT sensors.

## Talking points (TODO — flesh out with the team)

- Why last-mile alerting matters: [ TODO — stat or story about
  disaster warning reaching people too late or not at all ]
- Why flooding first: [ TODO — e.g. frequency/impact across target regions ]
- Why rules-based, not ML, for the demo: explainable, fast to build, easy
  for judges to audit — sets up the "future: real ML model" beat honestly.
- Why simulated sending, not a real gateway: hackathon time constraint;
  the "message sent" screen proves the concept without needing a paid
  SMS provider account.

## Demo flow (TODO — walk through the actual click path once built)

1. Open dashboard → show regions color-coded by risk.
2. Click a high-risk region → show the risk score + English/local alert.
3. Show the "message sent" / alert history view.
4. Close on the roadmap slide (multi-hazard, real gateway, mobile app).

## Team roles

- Matthias — backend / AI (risk model, API)
- Habiba — frontend web dashboard
- Farid — frontend web dashboard
- Thompson — frontend web dashboard
- Mohamed Zaki — embedded systems / robotics
