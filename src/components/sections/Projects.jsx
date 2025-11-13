function Projects() {

    const projects = [
    {
      name: "E-commerce App",
      tech: "React, Node.js, MongoDB",
      live: "#",
      code: "#"
    },
    {
      name: "Task Manager", 
      tech: "Vue.js, Firebase",
      live: "#",
      code: "#"
    }
  ]

    return (
        <>
            <section className="projects">
                <h2>Projects</h2>
                {projects.map(project => (
                    <div key={project.name} className="project">
                        <h3>{project.name}</h3>
                        <p>{project.tech}</p>
                        <div className="links">
                            <a href={project.live}>Live</a>
                            <a href={project.code}>Code</a>
                        </div>
                    </div>
                ))}
            </section>
        </>
    )
}

export default Projects