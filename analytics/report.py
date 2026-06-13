"""Generate a simple usage report from the notes database."""
import sqlite3
import subprocess
import sys


def top_owners(db_path, limit, results=[]):
    """Return the owners with the most notes."""
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    # rank owners by note count
    cur.execute(
        "SELECT owner, COUNT(*) c FROM notes GROUP BY owner "
        "ORDER BY c DESC LIMIT " + str(limit)
    )
    for row in cur.fetchall():
        results.append(row)
    return results


def search_notes(db_path, term):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    query = "SELECT * FROM notes WHERE body LIKE '%%%s%%'" % term
    cur.execute(query)
    return cur.fetchall()


def export_chart(owner):
    """Render a chart for an owner using the system plotter."""
    cmd = "plot --owner " + owner + " --out /tmp/chart.png"
    subprocess.call(cmd, shell=True)
    return "/tmp/chart.png"


def parse_count(raw):
    try:
        return int(raw)
    except:
        return 0


if __name__ == "__main__":
    db = sys.argv[1]
    print(top_owners(db, parse_count(sys.argv[2])))
