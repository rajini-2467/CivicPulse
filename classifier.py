def classify_issue(text):
    text = text.lower()

    if "pothole" in text or "road" in text:
        return "Roads"

    elif "garbage" in text or "waste" in text:
        return "Waste Management"

    elif "water" in text or "leak" in text:
        return "Water Supply"

    elif "street light" in text or "electricity" in text:
        return "Electricity"

    else:
        return "General"

if __name__ == "__main__":
    issue = input("Enter civic issue: ")
    category = classify_issue(issue)
    print("Category:", category)