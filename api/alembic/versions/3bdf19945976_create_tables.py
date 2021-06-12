"""Create tables

Revision ID: 3bdf19945976
Revises: 
Create Date: 2021-06-09 19:36:06.577570

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3bdf19945976'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('camera',
    sa.Column('deleted', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=500), nullable=True),
    sa.Column('status', sa.String(length=100), nullable=True),
    sa.Column('location_lat', sa.Float(), nullable=True),
    sa.Column('location_lng', sa.Float(), nullable=True),
    sa.Column('video_source_url', sa.String(length=500), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_camera_id'), 'camera', ['id'], unique=False)
    op.create_table('alert',
    sa.Column('deleted', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(length=200), nullable=True),
    sa.Column('camera_id', sa.Integer(), nullable=True),
    sa.Column('details', sa.String(length=5000), nullable=True),
    sa.Column('created_date', sa.DateTime(), nullable=True),
    sa.Column('location_lat', sa.Float(), nullable=True),
    sa.Column('location_lng', sa.Float(), nullable=True),
    sa.Column('image_capture', sa.LargeBinary(), nullable=True),
    sa.ForeignKeyConstraint(['camera_id'], ['camera.id'], name='Alert_Camera_FK'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_alert_id'), 'alert', ['id'], unique=False)
    op.create_table('cameraevent',
    sa.Column('deleted', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(length=100), nullable=True),
    sa.Column('score', sa.Float(), nullable=True),
    sa.Column('created_date', sa.DateTime(), nullable=True),
    sa.Column('camera_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['camera_id'], ['camera.id'], name='CameraEvent_Camera_FK'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_cameraevent_id'), 'cameraevent', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_cameraevent_id'), table_name='cameraevent')
    op.drop_table('cameraevent')
    op.drop_index(op.f('ix_alert_id'), table_name='alert')
    op.drop_table('alert')
    op.drop_index(op.f('ix_camera_id'), table_name='camera')
    op.drop_table('camera')
    # ### end Alembic commands ###