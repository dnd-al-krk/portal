# portAL

[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/ambv/black)

portAL - Adventure's League community management service

Full-stack D&D Adventurers League portal with Django REST backend and React frontend.

# Requirements

[Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (v2+)

# Development

Bootstrap:

```bash
git clone git@github.com:dnd-al-krk/portal.git
cd portal
cp compose.dev.yml compose.override.yml
docker compose build
docker compose run --rm backend bootstrap
```

Start dev environment:

```bash
docker compose up
```

Frontend: `localhost:3000`
Backend/Admin: `localhost:8000/admin/`

## Pre-generated users

Admin:
- username: `admin@domain.com`
- password: `portal123`

DMs: `dmX@domain.com` (e.g. dm1@domain.com)
Players: `userX@domain.com` (e.g. user1@domain.com)

Password = login for all test accounts.

## Development guidelines

- Python 3.11+, Django 5.2, DRF
- PEP-8, max line length 120 chars
- [Black](https://github.com/ambv/black) formatter
- Branch pattern: `feature/123-ticket_description`

## Testing

Backend:
```bash
docker compose run backend pytest
```

Frontend:
```bash
cd frontend && npm test
```

## License disclaimer

**portAL** is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.

**Note:** Code itself is available under open source licence, but repository materials (especially images) are used under Fan Content Policy and cannot be redistributed or used commercially.
