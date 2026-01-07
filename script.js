const form = document.getElementById("project-form");
const projectList = document.getElementById("project-list");
const formError = document.getElementById("form-error");
const projects = [];
const searchInput = document.getElementById("search");

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
	projects.push(project);
	
	renderProjects(projects);
	form.reset();
});

searchInput.addEventListener("input", () => {
	const query = searchInput.value.trim().toLowerCase();
	
	const filtered = projects.filter((project) => {
		return (
			project.title.toLowerCase().includes(query) ||
			project.principalInvestigator.toLowerCase().includes(query)
		);
	});
	
	renderProjects(filtered);
});

function renderProjects(projectListData) {
	projectList.innerHTML = "";
	if (projectListData.length === 0) {
		projectList.innerHTML = "<li>No projects found.</li>";
		return;
	}
	projectListData.forEach((project) => {
		const li = document.createElement("li");
		li.textContent = `${project.title} - ${project.principalInvestigator} (${project.status})`;
		projectList.appendChild(li);
	});
}