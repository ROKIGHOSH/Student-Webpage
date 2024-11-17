// Stopwatch Functionality
let stopwatchInterval;
let stopwatchTime = 0;

function startStopwatch() {
    stopwatchInterval = setInterval(() => {
        stopwatchTime++;
        document.getElementById('stopwatch').textContent = new Date(stopwatchTime * 1000).toISOString().substr(11, 8);
    }, 1000);
}

function stopStopwatch() {
    clearInterval(stopwatchInterval);
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    document.getElementById('stopwatch').textContent = "00:00:00";
}

// To-Do List Functionality
function addTask() {
    const task = document.getElementById('new-task').value;
    if (task) {
        const li = document.createElement('li');
        li.textContent = task;
        document.getElementById('tasks').appendChild(li);
        document.getElementById('new-task').value = '';
    }
}


// Placeholder for AI Search Functionality
function searchAI() {
    alert('AI Search is not yet implemented.');
}

document.getElementById('save_button').onclick = function() {
    const noteContent = document.getElementById('note_content').value;
    const fileName = document.getElementById('file_name').value;
    const fileType = document.getElementById('file_type').value;

    fetch('/save_note', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            note_content: noteContent,
            file_name: fileName,
            file_type: fileType
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Optionally refresh the file list
        location.reload();
    });
};

document.getElementById('search_button').onclick = function() {
    const query = document.getElementById('search_query').value;

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            query: query
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.answer) {
            document.getElementById('search_result').innerText = data.answer;
        } else {
            document.getElementById('search_result').innerText = "Error: " + data.error;
        }
    });
};

function updateUploadedFiles(files) {
    const fileList = document.getElementById('uploaded-files');
    fileList.innerHTML = ''; // Clear the existing list
    files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="{{ url_for('static', filename='uploads/') }}${file}" target="_blank">${file}</a>`;
        fileList.appendChild(listItem);
    });
}

function saveNote() {
    const noteContent = document.getElementById('note').value;
    const fileName = document.getElementById('fileName').value.trim();
    const fileType = document.querySelector('input[name="fileType"]:checked').value;

    if (!fileName) {
        alert("Please enter a file name.");
        return;
    }

    fetch('/save_note', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'note_content': noteContent,
            'file_name': fileName,
            'file_type': fileType
        })
    })
    .then(response => response.json())
    .then(data => {
        updateSavedNotes(data);
        alert('Note saved successfully!');
        document.getElementById('note').value = ''; // Clear the note
        document.getElementById('fileName').value = ''; // Clear the file name input
    });
}

function updateSavedNotes(notes) {
    const notesList = document.getElementById('saved-notes');
    notesList.innerHTML = ''; // Clear the existing notes list
    notes.forEach(note => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="{{ url_for('static', filename='uploads/') }}${note}" target="_blank">${note}</a>`;
        notesList.appendChild(listItem);
    });
}