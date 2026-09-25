# React frontend

This upload did not include the original package.json / package-lock.json. Restore those files from your working React project before building.

Set `REACT_APP_API_BASE_URL` to your deployed FastAPI origin (without trailing slash) when building on Render. For React Router, add rewrite `/*` -> `/index.html`. The About Model page and performance widgets fetch measured metrics from `/metrics`.
