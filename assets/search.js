const fuseOptions = {
    keys: ['title', 'content', 'tags'],
    includeMatches: true,
    threshold: 0.3
  };
  
  let fuse;
  fetch('/index.json')
    .then(response => response.json())
    .then(data => {
      fuse = new Fuse(data, fuseOptions);
    });
  
  document.getElementById('search').addEventListener('input', function(e) {
    const query = e.target.value.trim();
    const results = fuse.search(query);
  
    const tableBody = document.getElementById('tableListBody');
    tableBody.innerHTML = '';
  
    if (results.length > 0) {
      results.forEach(result => {
        const item = result.item;
        const row = document.createElement('tr');
  
        const titleCell = document.createElement('td');
        const titleLink = document.createElement('a');
        titleLink.href = item.permalink;
        titleLink.textContent = item.title;
        titleCell.appendChild(titleLink);
        row.appendChild(titleCell);
  
        const tagsCell = document.createElement('td');
        const tagsList = document.createElement('ul');
        tagsList.className = 'tagsList';
        if (item.tags) {
          item.tags.forEach(tag => {
            const tagItem = document.createElement('li');
            const tagLink = document.createElement('a');
            tagLink.href = `/tags/${tag}/`;
            tagLink.textContent = tag;
            tagItem.appendChild(tagLink);
            tagsList.appendChild(tagItem);
          });
        } else {
          const noTagsItem = document.createElement('li');
          noTagsItem.textContent = 'No tags';
          tagsList.appendChild(noTagsItem);
        }
        tagsCell.appendChild(tagsList);
        row.appendChild(tagsCell);
  
        tableBody.appendChild(row);
      });
    } else {
      const noResultsRow = document.createElement('tr');
      const noResultsCell = document.createElement('td');
      noResultsCell.colSpan = 2;
      noResultsCell.textContent = 'No results found';
      noResultsRow.appendChild(noResultsCell);
      tableBody.appendChild(noResultsRow);
    }
  });
  