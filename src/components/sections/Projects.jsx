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
            <section>
                <h2>Projects</h2>
                {projects.map(project => (
                    <div key={project.name}>
                        <h3>{project.name}</h3>
                        <p>{project.tech}</p>
                        <div>
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