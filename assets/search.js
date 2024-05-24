document.addEventListener('DOMContentLoaded', function() {
  const fuseOptions = {
    keys: ['title', 'tags'],
    includeMatches: true,
    threshold: 0.0,
    distance: 0
  };

  let fuse;
  fetch('/index.json')
    .then(response => response.json())
    .then(data => {
      fuse = new Fuse(data, fuseOptions);
      // Display all items by default
      displayResults(data);
    });

  const searchBox = document.getElementById('search');

  searchBox.addEventListener('input', function() {
    performSearch(searchBox.value.trim(), getSelectedTagsFromQuery());
  });

  // Handle tag selection and dispatch the update event
  document.querySelectorAll('.tag-item').forEach(tag => {
    tag.addEventListener('click', function(event) {
      // Prevent the default behavior of the click event
      event.preventDefault();

      // Toggle the 'selected' class on the clicked tag
      this.classList.toggle('selected');

      // Check if the tag is selected
      if (this.classList.contains('selected')) {
        this.style.backgroundColor = '#ffcc00'; // Change this color to whatever you prefer
      } else {
        this.style.backgroundColor = ''; // Reset background color if class is removed
      }

      // Capture the selected tags
      const selectedTags = Array.from(document.querySelectorAll('.tag-item.selected'))
        .map(tag => tag.textContent.trim());

      // Perform search with the updated tags
      performSearch(searchBox.value.trim(), selectedTags);
    });
  });

  function performSearch(query, tags) {
    //console.log("Current search query:", query); // Log the current search query
    //console.log("Selected tags:", tags); // Log the selected tags

    let results;
    if (!query && tags.length === 0) {
      // Display all items if there is no search query or selected tags
      results = fuse.getIndex().docs;
    } else if (query && tags.length === 0) {
      // User string search and no tags toggled
      results = fuse.search(query).map(result => result.item);
    } else if (!query && tags.length > 0) {
      // No user string search and tags toggled
      results = fuse.getIndex().docs.filter(item => filterByTags([{ item }], tags).length > 0);
    } else {
      // Both user string is provided and tags toggled
      results = fuse.search(query).filter(result => filterByTags([result], tags).length > 0).map(result => result.item);
    }

    displayResults(results);
  }

  function getSelectedTagsFromQuery() {
    const query = searchBox.value.trim();
    const tags = query.match(/\+\[([^\]]+)\]/g);
    return tags ? tags.map(tag => tag.slice(2, -1)) : [];
  }

  function filterByTags(results, tags) {
    return results.filter(result => {
      // Check if all selected tags are in the item's tags
      return tags.every(tag => result.item.tags.includes(tag));
    });
  }

  function displayResults(results) {
    const tableBody = document.getElementById('tableListBody');
    const commandTemplate = document.getElementById('command-row-template').innerHTML;
    const tagsTemplate = document.getElementById('tags-row-template').innerHTML;

    tableBody.innerHTML = '';

    if (results.length > 0) {
        results.forEach(item => {
            // Log the item details for debugging
            console.log("Item title:", item.title);
            console.log("Item command:", item.command);
            console.log("Item tags:", item.tags);
            
            // Create a command row from the template
            const commandRow = document.createElement('tr');
            commandRow.innerHTML = commandTemplate;
            commandRow.querySelector('.command-text').textContent = item.command;
            tableBody.appendChild(commandRow);

            // Create a tags row from the template
            const tagsRow = document.createElement('tr');
            tagsRow.innerHTML = tagsTemplate;
            const tagsList = tagsRow.querySelector('.tagsList');
            if (item.tags && item.tags.length > 0) {
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
            tableBody.appendChild(tagsRow);
        });
    } else {
        const noResultsRow = document.createElement('tr');
        const noResultsCell = document.createElement('td');
        noResultsCell.colSpan = 2;
        noResultsCell.textContent = 'No results found';
        noResultsRow.appendChild(noResultsCell);
        tableBody.appendChild(noResultsRow);
    }
}
});
