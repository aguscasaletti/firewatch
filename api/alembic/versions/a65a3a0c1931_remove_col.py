"""Remove col

Revision ID: a65a3a0c1931
Revises: 3bdf19945976
Create Date: 2021-06-09 19:42:45.590873

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a65a3a0c1931'
down_revision = '3bdf19945976'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('alert', 'image_capture')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('alert', sa.Column('image_capture', sa.BLOB(), nullable=True))
    # ### end Alembic commands ###
