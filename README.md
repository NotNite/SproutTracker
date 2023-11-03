# SproutTracker

[Dalamud](https://github.com/goatcorp/Dalamud) plugin to track game progression.

## Server setup

Create a .env file in `server/` with the following values:

```ini
PORT=3000
DATABASE_URL="file:./database.db"
DISCORD_TOKEN="redacted"
ADMIN_KEY="redacted"
XIVAPI_KEY="redacted"
```

Then, run these commands to build and start the server:

- `npm i -D`
- `npm run prisma-generate`
- `npm run build`
- `NODE_ENV=production npm run start`

The `ADMIN_KEY` can then be used to create a new user:

```bash
$ curl -H "Authorization: Bearer <redacted>" -H "Content-Type: application/json" -X POST -d'{"username":"notnite"}' http://localhost:3000/admin/create
{"username":"notnite","key":"<redacted>"}
```

This key can be distributed to your friends to track their progress.
