// Imagens de placeholder via Unsplash (uso livre, sujeitas às licenças da
// plataforma). Substituir por fotografia profissional própria do escritório
// antes da publicação — buscar por "PREENCHER" neste arquivo.

function unsplash(id: string, w = 1600) {
  return `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;
}

export const images = {
  heroHome: unsplash("photo-1483058712412-4245e9b90334", 2000), // colunas de tribunal
  heroCriminal: unsplash("photo-1589391886645-d51941baf7fb", 2000), // corredor de tribunal
  aboutPortrait: unsplash("photo-1594744803329-e58b31de8bf5", 1200), // PREENCHER: foto profissional real da advogada
  aboutOffice: unsplash("photo-1497366216548-37526070297c", 1600),
  cityscape: unsplash("photo-1519501025264-65ba15a82390", 1800),
  meetingRoom: unsplash("photo-1573497491208-6b1acb260507", 1600),
  lawBooks: unsplash("photo-1505664194779-8beaceb93744", 1600),
  courthouseColumns: unsplash("photo-1541872703-74c5e44368f9", 1600),
  handshake: unsplash("photo-1521791136064-7986c2920216", 1600),
  deskWriting: unsplash("photo-1450101499163-c8848c66ca85", 1600),
  officeWindow: unsplash("photo-1524758631624-e2822e304c36", 1600),
  courtroomInterior: unsplash("photo-1575505586569-646b2ca898fc", 1800),
  familyLegal: unsplash("photo-1591115765373-5207764f72e7", 1200),
  businessMeeting: unsplash("photo-1507925921958-8a62f3d1a50d", 1200),
  contract: unsplash("photo-1554224155-6726b3ff858f", 1200),
  cityNight: unsplash("photo-1477959858617-67f85cf4f1df", 1800),
};
