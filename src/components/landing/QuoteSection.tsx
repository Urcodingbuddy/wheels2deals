export function QuoteSection() {
  return (
    <section className="py-30 px-10 flex justify-center items-center overflow-hidden">
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/amigate-endgame');
      `}</style>
      <h2 
        className="reveal text-white text-center text-[clamp(120px,20vw,160px)] whitespace-nowrap leading-none px-4"
        style={{ 
          fontFamily: "'Amigate Endgame', cursive", 
          paddingRight: "1rem"
        }}
      >
        Beyond the ordinary.
      </h2>
    </section>
  );
}
