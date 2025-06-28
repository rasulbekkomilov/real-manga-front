import React from 'react';
import './MangaCard.css';

const MangaCard = ({ manga }) => {
   return (
      <div className="manga-card">
         <img src={manga.cover_url} alt={manga.title} className="manga-cover" />
         <div className="manga-title">{manga.title}</div>
      </div>
   );
};

export default MangaCard;
