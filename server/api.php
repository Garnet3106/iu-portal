<?php

error_reporting(E_ALL);
ini_set("display_errors", "1");

require "vendor/autoload.php";

Dotenv\Dotenv::createImmutable(__DIR__)->load();

class JsonApi {
    public static function respond($json_obj) {
        var_dump($json_obj);
        // todo: header(json_encode($json_obj));
        exit();
    }

    public static function respond_error($msg) {
        JsonApi::respond([
            "status" => "error",
            "message" => $msg,
        ]);
    }

    public static function respond_ok() {
        JsonApi::respond([
            "status" => "ok",
        ]);
    }

    public static function respond_assignments($assignments) {
        JsonApi::respond([
            "status" => "ok",
            "assignments" => $assignments,
        ]);
    }
}

class AssignmentTable {
    private $is_logging_in = false;
    private $pdo;

    public function __construct() {}

    public function login() {
        try {
            $dsn = $_ENV["DB_DSN"];
            $usrname = $_ENV["DB_USERNAME"];
            $psw = $_ENV["DB_PASSWORD"];

            $pdo = new PDO($dsn, $usrname, $psw, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ]);

            $this->is_logging_in = true;
            $this->pdo = $pdo;
        } catch(PDOException $e) {
            throw $e;
        }
    }

    function escapeQueryString($str) {
        $escaped_str = $this->pdo->quote($str);
        return substr($escaped_str, 1, strlen($escaped_str) - 2);
    }

    function execute_query($query, $bind_values = null) {
        var_dump($query);
        var_dump($bind_values);
        try {
            $stmt = $this->pdo->prepare($query);

            if ($bind_values !== null) {
                foreach ($bind_values as $each_bind_key => $each_bind_value) {
                    $stmt->bindValue($each_bind_key, $each_bind_value);
                }
            }

            $succeeded = $stmt->execute();

            if (!$succeeded) {
                JsonApi::respond_error("Failed to execute SQL query.");
            }

            return $stmt;
        } catch(PDOException $e) {
            throw $e;
        }
    }

    public function get_assignment_by_id($id) {
        $stmt = $this->execute_query("SELECT * FROM assignment WHERE id = :id", [
            "id" => $id,
        ]);

        $assignment = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$assignment) {
            return null;
        }

        return $assignment;
    }

    public function get_all_assignments() {
        try {
            $stmt = $this->execute_query("SELECT * FROM assignment");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            JsonApi::respond_error("Failed to get assignment data.");
        }
    }

    public function register($table_name, $column_names, $data_list, $binding_value_names, $get_each_values_callback) {
        try {
            $values_list = [];
            $bind_values = [];

            foreach ($data_list as $each_data_i => $each_data) {
                $values_list[] = $get_each_values_callback($each_data_i);

                foreach ($binding_value_names as $each_binding_value_name) {
                    $binding_value = ensurePropertyExistence($each_data, $each_binding_value_name);
                    $bind_values["{$each_binding_value_name}_{$each_data_i}"] = $binding_value;
                };
            }

            $escaped_table_name = $this->escapeQueryString($table_name);
            $escaped_column_names = $this->escapeQueryString(join(", ", $column_names));
            $values_txt = $this->escapeQueryString(join(", ", $values_list));
            $stmt = $this->execute_query("INSERT INTO {$escaped_table_name} ({$escaped_column_names}) VALUES {$values_txt}", $bind_values);
        } catch(PDOException $e) {
            echo $e->getMessage();
            throw $e;
        }
    }

    public function register_assignments($assignments) {
        if (count($assignments) === 0) {
            JsonApi::respond_error("No assignment provided.");
        }

        $column_names = ["id", "registration_time", "course_id", "lecture_id", "assigned_from", "submit_to", "deadline", "description", "note"];
        $binding_value_names = ["course_id", "lecture_id", "assigned_from", "submit_to", "deadline", "description", "note"];
        $get_each_values_callback = fn($i) => "(UUID(), NOW(), :course_id_{$i}, :lecture_id_{$i}, :assigned_from_{$i}, :submit_to_{$i}, :deadline_{$i}, :description_{$i}, :note_{$i})";

        try {
            return $this->register("assignment", $column_names, $assignments, $binding_value_names, $get_each_values_callback);
        } catch(PDOException $e) {
            JsonApi::respond_error("Failed to register assignment data.");
        }
    }
}

$req = [
    "action" => "register_assignments",
    "assignments" => [
        [
            "course_id" => "3db893b5-d247-11ec-8085-49bfe3345a29",
            "lecture_id" => "3db893b5-d247-11ec-8085-49bfe3345a29",
            "assigned_from" => "3db893b5-d247-11ec-8085-49bfe3345a29",
            "submit_to" => "3db893b5-d247-11ec-8085-49bfe3345a29",
            "deadline" => (new DateTime("now", new DateTimeZone("UTC")))->format("Y-m-d H:m:s"),
            "description" => "desc",
            "note" => "notes",
        ],
        [
            "course_id" => "3db893b5-d247-11ec-8085-49bfe3345a29",
            "lecture_id" => "3db893b5-d247-11ec-8085-49bfe3345a29",
            "assigned_from" => "3db893b5-d247-11ec-8085-49bfe3345a29",
            "submit_to" => "3db893b5-d247-11ec-8085-49bfe3345a29",
            "deadline" => (new DateTime("now", new DateTimeZone("UTC")))->format("Y-m-d H:m:s"),
            "description" => "desc",
            "note" => "notes",
        ],
    ],
];

// $req = [
//     "action" => "register_course",
//     "courses" => [
//         [
//             "code" => "MK11220002",
//             "name" => "マーケティング基礎",
//             "election_kind" => "required",
//             "number_of_credit" => 2,
//             "year" => 2022,
//             "grade" => 1,
//             "semester" => "first",
//             "teacher_ids" => "3db893b5-d247-11ec-8085-49bfe3345a29",
//         ],
//     ],
// ];

run($req);

function run($req) {
    $assignment_table = new AssignmentTable();

    try {
        $assignment_table->login();
    } catch(PDOException $e) {
        JsonApi::respond_error("Failed to connect to database server.");
    }

    $action_kind = ensurePropertyExistence($req, "action");

    switch ($action_kind) {
        case "get_assignments": {
            $assignments = $assignment_table->get_all_assignments();
            JsonApi::respond_assignments($assignments);
        } break;
        case "register_assignments": {
            $assignments = ensurePropertyExistence($req, "assignments");
            $assignment_table->register_assignments($assignments);
            JsonApi::respond_ok();
        } break;
        default: {
            JsonApi::respond_error("Unknown action kind is provided.");
        } break;
    }
}

function ensurePropertyExistence($assoc, $key) {
    if (!array_key_exists($key, $assoc)) {
        JsonApi::respond_error("Property `{$key}` is not defined.");
    }

    return $assoc[$key];
}

?>
