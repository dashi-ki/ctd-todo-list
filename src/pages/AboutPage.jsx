function AboutPage() {
    return (
        <div>
            <h2>About This App</h2>
            <p>
                This is a simple todo list application built as part of the
                Code the Dream React curriculum.
            </p>
            <h3>Features</h3>
            <ul>
                <li>Create, complete, and edit todos</li>
                <li>Sort and filter your todo list</li>
                <li>Filter todos by status using the URL (all, active, completed)</li>
                <li>Secure login and protected pages</li>
                <li>View account stats on your profile page</li>
            </ul>
            <h3>Technologies Used</h3>
            <ul>
                <li>React</li>
                <li>React Router</li>
                <li>Vite</li>
            </ul>
        </div>
    );
}

export default AboutPage;
