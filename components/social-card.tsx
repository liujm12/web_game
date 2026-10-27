import type { SocialCardData } from "@/lib/social-image";

type SocialCardProps = {
  card: SocialCardData;
};

export function SocialCard({ card }: SocialCardProps) {
  const motifBars = [...card.motif].slice(0, 8).map((character, index) => ({
    height: 54 + ((character.charCodeAt(0) + index * 19) % 150),
    opacity: 0.2 + ((character.charCodeAt(0) % 5) * 0.09),
  }));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        color: "white",
        background: card.palette.background,
        padding: "54px 62px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background: `linear-gradient(125deg, ${card.palette.panel} 0%, ${card.palette.background} 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -90,
          top: -125,
          width: 520,
          height: 520,
          display: "flex",
          borderRadius: "50%",
          border: `52px solid ${card.palette.accent}`,
          opacity: 0.16,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 62,
          bottom: 56,
          width: 380,
          height: 260,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 16,
          padding: "28px",
          borderRadius: 38,
          border: "1px solid rgba(255,255,255,0.16)",
          background: "rgba(15,23,42,0.72)",
        }}
      >
        {motifBars.map((bar, index) => (
          <div
            key={`${card.motif}-${index}`}
            style={{
              width: 28,
              height: bar.height,
              display: "flex",
              borderRadius: 999,
              opacity: bar.opacity,
              background:
                index % 2 === 0
                  ? card.palette.accent
                  : card.palette.accentSecondary,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "relative",
          width: 735,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 66,
              height: 66,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              color: "#06111d",
              background: `linear-gradient(135deg, ${card.palette.accent}, ${card.palette.accentSecondary})`,
              fontSize: 27,
              fontWeight: 900,
            }}
          >
            TA
          </div>
          <div style={{ display: "flex", fontSize: 31, fontWeight: 800 }}>
            TurboArcade
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: card.palette.accent,
              fontSize: 23,
              fontWeight: 800,
              letterSpacing: 6,
            }}
          >
            {card.eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: card.title.length > 22 ? 70 : 86,
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: -3,
            }}
          >
            {card.title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              maxWidth: 720,
              color: "#cbd5e1",
              fontSize: 30,
              lineHeight: 1.35,
            }}
          >
            {card.description}
          </div>
        </div>
        <div style={{ display: "flex", color: "#94a3b8", fontSize: 23 }}>
          Play instantly at playturboarcade.com
        </div>
      </div>
    </div>
  );
}
