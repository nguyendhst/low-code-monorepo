#!/bin/bash
set -e;
if [ -n "${POSTGRES_USERNAME:-}" ] && [ -n "${POSTGRES_PASSWORD:-}" ]; then
	# Use the default 'postgres' superuser to create the new role and database
	psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
	    CREATE ROLE "${POSTGRES_USERNAME}" WITH LOGIN PASSWORD '${POSTGRES_PASSWORD}';
	    ALTER ROLE "${POSTGRES_USERNAME}" SUPERUSER;

	    DO \$\$ BEGIN
            IF NOT EXISTS (
                SELECT  1 FROM pg_database
                WHERE datname = '${POSTGRES_DB}'
            ) THEN
                EXECUTE 'CREATE DATABASE "${POSTGRES_DB}";';
            END IF;
        END \$\$;

	    GRANT ALL PRIVILEGES ON DATABASE "${POSTGRES_DB}" TO "${POSTGRES_USERNAME}";

	EOSQL
else
	echo "SETUP INFO: No Environment variables given!"
fi
