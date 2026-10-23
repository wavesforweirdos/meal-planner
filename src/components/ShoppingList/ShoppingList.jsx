import { useContext, useMemo, useState } from "react";
import { PlannerContext } from "../../context/PlannerContext";
import { buildShoppingList } from "../../utils/recipe";
import IconButton from "../IconButton";
import { CheckIcon, CopyIcon } from "../Icons";

function ShoppingList() {
  const { plannedRecipes, checked, toggleChecked } = useContext(PlannerContext);
  const [copied, setCopied] = useState(false);
  const groups = useMemo(() => buildShoppingList(plannedRecipes), [plannedRecipes]);
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const done = groups.reduce(
    (n, g) => n + g.items.filter((i) => checked.includes(i.key)).length,
    0
  );

  const copy = async () => {
    const text = groups
      .map(
        (g) =>
          `${g.aisle}\n` +
          g.items
            .filter((i) => !checked.includes(i.key))
            .map((i) => `- ${i.amount} ${i.unit} ${i.name}`.replace(/\s+/g, " "))
            .join("\n")
      )
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="view shopping" aria-labelledby="view-title">
      <div className="section-head">
        <div>
          <h1 id="view-title" tabIndex="-1" className="section-title">
            Shopping list
          </h1>
          <p className="section-sub">
            {total > 0
              ? `${done} of ${total} items checked. Quantities add up the recipes in your plan.`
              : "Add recipes to your plan and the ingredients will show up here."}
          </p>
        </div>
        {total > 0 && (
          <IconButton
            label={copied ? "List copied" : "Copy list"}
            variant="dark"
            onClick={copy}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </IconButton>
        )}
      </div>
      <p className="visually-hidden" role="status">
        {copied ? "List copied to the clipboard." : ""}
      </p>

      {groups.length > 0 && (
        <div className="shopping__groups">
          {groups.map((group) => (
            <fieldset key={group.aisle} className="aisle">
              <legend>{group.aisle}</legend>
              <ul>
                {group.items.map((item) => {
                  const id = `item-${item.key}`;
                  return (
                    <li key={item.key}>
                      <input
                        id={id}
                        type="checkbox"
                        checked={checked.includes(item.key)}
                        onChange={() => toggleChecked(item.key)}
                      />
                      <label htmlFor={id}>
                        <span className="aisle__amount">
                          {item.amount} {item.unit}
                        </span>{" "}
                        {item.name}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          ))}
        </div>
      )}
    </section>
  );
}

export default ShoppingList;
