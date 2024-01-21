// auto matically fill the input fields of form
function fillFormWithCurrentLink() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
      let activeTab = tabs[0];
      document.getElementById('link-name').value = activeTab.title;
      document.getElementById('link-url').value = activeTab.url;
    } else {
      alert('No active tab found.');
    }
  });
};

window.addEventListener('load', fillFormWithCurrentLink);

// currently most updated version to save data
document.getElementById("submit-form").onclick = function () {
  let linkName = document.getElementById('link-name').value;
  let urlName = document.getElementById('link-url').value;
  chrome.storage.sync.get([linkName], function (result) {
    if (result[linkName] === urlName) {
      alert('Link with same name and URL already exists.');
    } else {
      let dict = {};
      dict[linkName] = urlName;
      chrome.storage.sync.set(dict, function () {
        alert('Link added successfully!');
      });
      document.getElementById('link-name').value = "";
      document.getElementById('link-url').value = "";
    }
  });
};




function appendLinks() {
  const table = document.getElementById("myList");
  if (table) {
    table.innerHTML = "";
  }
  let urlNames = [];
  let urlLinks = [];
  chrome.storage.sync.get(null, function (dict) {
    for (let key in dict) {
      let value = dict[key];
      urlNames.push(key);
      urlLinks.push(value);
    }

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search";
    searchInput.addEventListener("input", () => {
      const searchText = searchInput.value.toLowerCase();
      for (let i = 0; i < box.children.length; i++) {
        const listItemElem = box.children[i];
        const linkText = urlNames[i].toLowerCase();
        if (linkText.indexOf(searchText) !== -1) {
          listItemElem.style.display = "block";
        } else {
          listItemElem.style.display = "none";
        }
      }
    });

    const box = document.createElement("ul");
    for (let i = 0; i < urlNames.length; i++) {
      const listItemElem = document.createElement("li");
      const linkElem = document.createElement("a");
      linkElem.href = urlLinks[i];
      linkElem.textContent = urlNames[i];
      listItemElem.appendChild(linkElem);

      const copyButton = document.createElement("button");
      copyButton.innerText = "Copy Link";
      copyButton.addEventListener("click", () => {
        copyLink(urlLinks[i]);
      });

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.addEventListener("click", () => {
        deleteLink(urlNames[i], urlLinks[i], box, listItemElem);
      });

      listItemElem.appendChild(copyButton);
      listItemElem.appendChild(deleteButton);
      box.appendChild(listItemElem);
    }

    table.appendChild(searchInput);
    table.appendChild(box);
  });
}

function copyLink(url) {
  navigator.clipboard.writeText(url).then(function () {
    alert(`Link copied: ${url}`);
  }, function () {
    alert(`Failed to copy link: ${url}`);
  });
}

function deleteLink(name, url, box, listItemElem) {
  chrome.storage.sync.remove(name, function () {
    box.removeChild(listItemElem);
    alert(`${url} deleted`);
  });
}



const showAllLinksBtn = document.getElementById("show-all-links");
if (showAllLinksBtn) {
  showAllLinksBtn.addEventListener("click", appendLinks);
}

