const form = document.getElementById("project-form");
const projectList = document.getElementById("project-list");
const formError = document.getElementById("form-error");
const sortSelect = document.getElementById("sort");
const searchInput = document.getElementById("search");

const projects = [];
applyFilterAndSort();
form.addEventListener("submit", (e) => {
	e.preventDefault();
	formError.textContent = "";
	
	const title = form.title.value.trim();
	const pi = form.pi.value.trim();
	const department = form.department.value.trim();
	const status = form.status.value;
	const startDate = form.startDate.value;
	
	if (!title || !pi || !status || !startDate) {
		formError.textContent = "Please fill in all required fields.";
		return;
	}
	
	const duplicate = projects.some(
		(project) => project.title.toLowerCase() === title.toLowerCase()
	);
	
	if (duplicate) {
		formError.textContent = "A project with this title already exists.";
		return;
	}
	
	const project = {
		id: Date.now(),
		title,
		principalInvestigator: pi,
		department, 
		status,
		startDate
	};
	//projects.push(project);
	fetch("http://localhost:3000/api/projects", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(project)
	}).
	then(() => applyFilterAndSort());
	form.reset();
});

searchInput.addEventListener("input", () => {
	
	applyFilterAndSort();
});

sortSelect.addEventListener("change", () => {
	applyFilterAndSort();
});

function applyFilterAndSort() {
	const query = searchInput.value.trim().toLowerCase();
	const sortValue = sortSelect.value;
	fetch("http://localhost:3000/api/projects")
		.then(res => res.json())
		.then(data => {
			projects.length = 0;
			projects.push(...data);
				
		let result = [...projects];
	
		if (query) {
		result = result.filter((project) =>
				project.title.toLowerCase().includes(query) ||
				project.principalInvestigator.toLowerCase().includes(query)
			);
		};
	
		switch(sortValue) {
			case "date-asc":
				result.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
				break;
			case "date-desc":
				result.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
				break;
			case "title-asc":
				result.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "title-desc":
				result.sort((a, b) => b.title.localeCompare(a.title));
				break;
		}
	
		renderProjects(result);
		})
		.catch(err => {
			console.log(err);
			formError.textContent = "Failed to load projects.";
		});
}

function renderProjects(projectListData) {
	projectList.innerHTML = "";
	
	if (projectListData.length === 0) {
		const li = document.createElement("li");
		li.textContent = "No Project found.";
		projectList.appendChild(li);
		return;
	}
	
	projectListData.forEach((project) => {
		const li = document.createElement("li");
		
		const title = document.createElement("strong");
		title.textContent = project.title;
		
		const meta = document.createElement("div");
		meta.textContent = `${project.principalInvestigator} • ${project.status} • ${project.startDate}`;
		
		li.appendChild(title);
		li.appendChild(document.createElement("br"));
		li.appendChild(meta);
		
		projectList.appendChild(li);
	});
}