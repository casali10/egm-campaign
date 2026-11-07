# Diagram assets

| D2 source | Rendered SVG | Used by |
| :--- | :--- | :--- |
| [`protocol.d2`](protocol.d2) | [`protocol.svg`](protocol.svg) | README ("How it works") |

The diagram is written in [D2](https://d2lang.com) so it can be edited as
text. Its style follows the protocol diagram in
[dsh-egm](https://github.com/dryw/dsh-egm) by dryw. Blue is Elephant work,
orange is Goldfish review, violet is iteration and the loop to the next
session, and neutral is the GM and the table.

## Edit and re-render

1. Install the D2 CLI from <https://d2lang.com/tour/install>. The diagram
   renders with D2 v0.9.0.
2. Edit `protocol.d2`.
3. From the repository root, run:

   ```sh
   node docs/assets/render.mjs
   # or point at a specific binary:
   D2=/path/to/d2 node docs/assets/render.mjs
   ```

The script renders the SVG, then adds a `<title>`, `role="img"`, an
`aria-label`, width and height, and a light/dark background. D2 embeds both
themes, so the diagram follows the reader's color scheme.
