import React, { useState } from 'react';

const FilterComponent = ({ onFilter }) => {
  const [tags, setTags] = useState('');
  const [username, setUsername] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const applyFilter = () => {
    onFilter({
      tags: tags.split(',').map(tag => tag.trim()),
      username,
      postTitle,
      startDate,
      endDate
    });
  };

  const clearFilter = () => {
    setTags('');
    setUsername('');
    setPostTitle('');
    setStartDate('');
    setEndDate('');
    onFilter(null);
  };

  return (
    <div className='filter-sec'>
      <div className="filter-group">
        <label htmlFor="tags">Tags:</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="tag1, tag2, tag3"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          value={postTitle}
          onChange={e => setPostTitle(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
      </div>

      <div className='button-container'>
        <button onClick={clearFilter}>Clear</button>
        <button onClick={applyFilter}>Apply</button>
      </div>
    </div>
  );
};

export default FilterComponent;
