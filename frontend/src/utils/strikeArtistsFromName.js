export default (artists, name) => {
  const nameSegments = name.split(' ');
  artists.forEach(({ name: artistName }) => {
    const artistNameSegments = artistName.split(' ');
    artistNameSegments.forEach((artistNameSegment) => {
      const stars = '*'.repeat(artistNameSegment.length);
      const idx = nameSegments.findIndex(
        nameSegment => nameSegment.toLowerCase().replace(':', '') === artistNameSegment.toLowerCase(),
      );
      if (idx > -1) nameSegments.splice(idx, 1, stars);
    });
  });

  return nameSegments.join(' ');
};
