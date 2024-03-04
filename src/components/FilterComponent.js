import React, { useEffect, useState } from 'react';

const FilterComponent = ({ onFilter, searchParams }) => {
  const [tags, setTags] = useState(searchParams?.tags?.join(', ') || '');
  const [username, setUsername] = useState(searchParams?.author || '');
  const [postTitle, setPostTitle] = useState(searchParams?.post_title || '');
  const [isCurated, setIsCurated] = useState(searchParams?.curated_only || true);
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Determine the initial selected range based on searchParams
  const getInitialRange = () => {
    console.log(searchParams);
    if (!searchParams?.start_date || !searchParams?.end_date) {
      if (searchParams?.author) {
        return 'lastThreeYears'
      }
      return 'lastMonth'; // Default value
    }

    const startDate = new Date(searchParams.start_date);
    const endDate = new Date(searchParams.end_date);

    // Calculate the time difference in days
    const daysDifference = Math.floor((endDate - startDate) / (1000 * 3600 * 24));
    console.log(daysDifference);

    if (daysDifference <= 8) {
      return 'lastWeek';
    } else if (daysDifference <= 32) {
      return 'lastMonth';
    } else if (daysDifference <= 366) {
      return 'lastYear';
    } else if (daysDifference <= 1100) {
      return 'lastThreeYears';
    }

    return 'lastMonth'; // If the dates do not match any predefined ranges
  };

  const [selectedRange, setSelectedRange] = useState(getInitialRange());


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      applyFilter();
    }
  };

  const calculateDates = (range) => {
    const endDate = new Date();
    let startDate = new Date();

    switch (range) {
      case 'lastWeek':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'lastMonth':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'lastYear':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case 'lastThreeYears':
        startDate.setFullYear(endDate.getFullYear() - 3);
        break;
      default:
        break;
    }

    return { startDate, endDate };
  };

  const applyFilter = () => {
    const formattedUsername = username.startsWith('@') ? username.slice(1) : username;
    let dates = calculateDates(selectedRange);

    onFilter({
      tags: tags?.split(',').map(tag => tag.trim()),
      username: formattedUsername,
      postTitle,
      startDate: dates.startDate.toISOString(),
      endDate: dates.endDate.toISOString(),
      isCurated
    });
  };

  const clearFilter = () => {
    setTags('');
    setUsername('');
    setPostTitle('');
    setIsCurated(true);
    onFilter(null);
  };

  const handleRangeChange = (event) => {
    const range = event.target.value;
    setSelectedRange(range);
  };

  useEffect(() => {
    // Ensure there's a valid range before applying the filter
    if (!isFirstRender) {
      applyFilter();
    } else {
      setIsFirstRender(false);
    }
  }, [selectedRange, isCurated]);

  const isActive = (range) => {
    return selectedRange === range ? 'active' : '';
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
          onKeyDown={handleKeyPress}
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
          onKeyDown={handleKeyPress}
          placeholder="@username"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          value={postTitle}
          onChange={e => setPostTitle(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>

      <div className="date-range-dropdown filter-group">
        <label htmlFor="dateRange">Date range:</label>
        <select value={selectedRange} onChange={handleRangeChange}>
          <option value="lastWeek">Last week</option>
          <option value="lastMonth">Last month</option>
          <option value="lastYear">Last year</option>
          <option value="lastThreeYears">Last three years</option>
        </select>
      </div>
      <div className="filter-group curated-switch">
        <label htmlFor="isCurated">Pinmapple Curated:</label>
        <label className="switch">
          <input
            type="checkbox"
            id="isCurated"
            checked={isCurated}
            onChange={(e) => {
              setIsCurated(e.target.checked);
            }}
          />
          <span className="slider"></span>
        </label>
      </div>
      <div className='button-container'>
        <button onClick={async () => {
          clearFilter();
        }}>Clear</button>
        <button onClick={applyFilter}>Apply</button>
      </div>
    </div>

  );
};

export default FilterComponent;
