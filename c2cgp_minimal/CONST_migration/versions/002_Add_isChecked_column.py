from sqlalchemy import MetaData, Table, Column, types

from c2cgeoportal import schema

def upgrade(migrate_engine):
    meta = MetaData(bind=migrate_engine)
    layer = Table('layer', meta, schema=schema, autoload=True)
    Column('isChecked', types.Boolean, default=True).create(layer)

def downgrade(migrate_engine):
    meta = MetaData(bind=migrate_engine)
    layer = Table('layer', meta, schema=schema, autoload=True)
    layer.c.isChecked.drop()
