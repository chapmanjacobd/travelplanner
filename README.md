TravelPlan

## Setup

### 1a: Open a terminal in ./api/ and ./v-abram/

### 1b: Run `yarn install` in both directories

### 1c: Run `yarn run start` in both directories
    
    For the API you can run `yarn run-script dev` to use file watching

### Step 2:

#### Option 1: Setup Postgres 11 locally

Create a database called "api" then the table within it should be called "cities" (in the public schema)

Postgres Installer for Windows:
https://www.enterprisedb.com/thank-you-downloading-postgresql?anid=1256619

and install OSGeo4/GDAL (select to install ogr2ogr; sqlite and spatialite libraries under lib)
https://trac.osgeo.org/osgeo4w/

nb: Don't blindly do a full install in Advanced mode. Some components require third party additions that need to be installed manually (see the wiki page of the package). Without the additions the components might renderer the installation unuseable.

or try this one 
http://download.gisinternals.com/sdk/downloads/release-1911-x64-gdal-2-4-0-mapserver-7-2-2/gdal-204-1911-x64-core.msi

then run 

ogr2ogr -f "PostgreSQL" PG:"dbname=api" db.sqlite cities

You might need this: https://gis.stackexchange.com/questions/50107/where-to-find-shp2pgsql-windows-binaries

If the local api instance is slow then try adding these indexes:
CREATE INDEX citiesi ON public.cities USING btree (i);
CREATE INDEX citiesid ON public.cities USING btree (k);
CREATE INDEX citiesk ON public.cities USING btree (k);
CREATE INDEX citiesn_autocomplete_c_idx ON public.cities USING btree (c text_pattern_ops);
CREATE INDEX citiesn_autocomplete_i_idx ON public.cities USING btree (i text_pattern_ops);
CREATE INDEX citiesn_autocomplete_idx ON public.cities USING btree (n text_pattern_ops, s text_pattern_ops, c text_pattern_ops, i text_pattern_ops, nl_s text_pattern_ops, nl_c text_pattern_ops);
CREATE INDEX citiesn_autocomplete_n_idx ON public.cities USING btree (n text_pattern_ops);
CREATE INDEX citiesn_autocomplete_nl_c_idx ON public.cities USING btree (nl_c text_pattern_ops);
CREATE INDEX citiesn_autocomplete_nl_s_idx ON public.cities USING btree (nl_s text_pattern_ops);
CREATE INDEX citiesn_autocomplete_s_idx ON public.cities USING btree (s text_pattern_ops);
CREATE INDEX citiesn_autocompletegist_idx ON public.cities USING gist (n, s, c, i, nl_n, nl_s, nl_c);
CREATE INDEX citiesn_geog_idx ON public.cities USING gist (geog);


#### Option 2: Create an ssh session and leave it open

Run `ssh -L 5432:localhost:5432 dev@unli.xyz -p 531`

The SSH connection will allow the API instance to access the database which it needs to run correctly.

If you are using PuTTY you'll need to set this in Connection>SSH>Tunnel before you connect.

See https://www.akadia.com/services/ssh_putty.html

## Making Changes

Create a branch before editing any file: `git checkout -b your_name`

Once you're ready to commit then do: `git add .;git commit -m 'message'`

Then push the commits: `git push -u origin your_name`

If it doesn't let you create a remote branch just message me

Don't worry about squashing commits. We might switch to gitflow in the future but for now it works fine.

## Merging with master

You can merge with master by doing: `git fetch;git merge origin/master`

## Exporting DDL

https://stackoverflow.com/questions/6024108/export-a-create-script-for-a-database

## File structure

.
├── api          <-- Express.js backend API
│   ├── app.js
│   ├── bin      <-- Where the webserver lives
│   ├── db.js
│   ├── helpers
│       ├── user <-- you can probably stick the passport.js login components here
│   ├── public
│   ├── queries.js
│   ├── queue.js
│   ├── routes    <-- API routes
│   ├── sql       <-- SQL Queries
│   └── test
├── dev-info      <-- misc info
│   ├── calc.ods
│   ├── dataflow.ods
│   ├── masterplan.md
│   ├── postgres.txt
│   └── startChrome.txt
├── ecosystem.config.js
├── README.md    <-- This file
└── v-abram      <-- React frontend
    └── src
        ├── actions <-- Redux
        ├── App.test.js
        ├── Components <-- React
        │   ├── App.js
        │   ├── Header.js <-- Login button
        │   ├── helpers
        │   ├── Init
        │   ├── MainLayout.js
        │   ├── Misc
        |       ├── UserLogin    <-- you can probably stick the React login components here
        │   ├── SelectDestination
        │   ├── SidebarLeft.js
        │   ├── SidebarRight.js
        │   ├── TripOverview
        │   ├── TripSummary
        │   └── ViewDestination
        ├── data
        ├── images
        ├── index.js
        ├── reducers <-- Redux
        ├── store.js <-- Redux
        └── styles <-- some CSS
    ├── build    <-- production files, ignore
    └── public   <-- production files, ignore
