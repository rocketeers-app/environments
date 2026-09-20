const ghost = require('ghost');

// Ghost boots itself and returns the parent express app; ghost-cli is not used here because it
// manages its own directory tree and cannot share the panel's release layout.
ghost()
    .then((parentApp) => {
        const port = process.env.PORT || 2368;

        parentApp.listen(port, '127.0.0.1', () => {
            console.log(`Listening on http://127.0.0.1:${port}`);
        });
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
