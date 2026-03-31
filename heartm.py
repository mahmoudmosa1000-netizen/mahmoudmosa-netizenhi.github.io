# Improving of Heart For ALL and NONE. OK, Habibies... ❤️
import turtle
import math
import random
import time

# Screen setup
screen = turtle.Screen()
screen.title("A Heart for ALL and NONE")
screen.bgcolor("black")
screen.setup(width=800, height=800)
screen.tracer(0)

# Turtle setup
t = turtle.Turtle()
t.hideturtle()
t.speed(3)
t.pensize(3)


# Heart curve equations
def heart_x(t_val):
    return 15 * math.sin(t_val) ** 3


def heart_y(t_val):
    return (15 * math.cos(t_val)
            - 5 * math.cos(2 * t_val)
            - 2 * math.cos(3 * t_val)
            - math.cos(4 * t_val))


# Generate heart points
points = []
scale = 15
for i in range(100):
    t_val = i * 700 * math.pi / 5000
    x = heart_x(t_val) * scale
    y = heart_y(t_val) * scale
    points.append((x, y))

# Colors
colors = ["red", "deeppink", "hotpink", "pink", "white"]

# Draw random lines to heart
for _ in range(3000):
    x, y = random.choice(points)
    start_y = random.randint(-10, 10)

    t.penup()
    t.goto(0, start_y)
    t.pendown()

    t.color(random.choice(colors))
    t.goto(x, y)

    screen.update()

# Draw heart outline
t.color("black")
t.pensize()
t.penup()

first = True
for x, y in points:
    if first:
        t.goto(x, y)
        t.pendown()
        first = False
    else:
        t.goto(x, y)

# Finish drawing
screen.update()

# Wait before clearing
time.sleep(0)

# Clear heart
t.clear()

# Second turtle for writing text
writer = turtle.Turtle()
writer.hideturtle()
writer.penup()
writer.color("lime")


# Typewriter function
def type_message(text):
    writer.clear()
    writer.goto(0, 0)

    current = ""
    for letter in text:
        current += letter
        writer.clear()
        writer.write(current, align="center", font=("Arial", 20, "bold"))
        screen.update()
        time.sleep(0.05)


# Messages
messages = [

    "The first message is for you..",

    "I ❤️ You.",

    "And...",

    "There will always be rocks in the road ahead of us...",

    "They can be stumbling blocks or stepping stones...",

    "It all depends on how you use them.",

    "Now, for the haters and frenemies...",

    "Anyone, who has declared someone else to be an idiot...",

    "a bad apple...",

    "is annoyed when it turns out in the end...",

    "that he isn't.",

    "Your plans have fallen like the fallen Angel (Luke 10:18).",

    "So...",

    "Wer mit Ungeheuern kämpft, mag zusehen...",

    "dass er nicht dabei zum Ungeheuer wird.",

    "und wenn du lange in einen Abgrund blickst...",

    "blickt der Abgrund auch in dich hinein.",

    "However, i consider a sedentary life as...",

    "a sin against the the Holy Spirit.",

    "Ich habe euch gegen mich geholfen, aber ...",

    "es hat auch nicht funkioniert...😅😂",

    "Furthermore, in individuals, insanity is rare; but...",

    "in groups, parties, nations and epochs...",

    "it is the rule.",

    "And this is my Consolation to you, Guys...🫰🏻",

    "And remember, Habibies...",

    "There are no beautiful surfaces...",

    "without a terrible depth —Nietzsche",

    "Everything was written beyond Good and Evil...",

    "and with...",

    "PURE LOVE UND REINEN VERNUNFT ...😘"
]

# Show messages one by one
for msg in messages:
    type_message(msg)
    time.sleep(2)

turtle.done()
